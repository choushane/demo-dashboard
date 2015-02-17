<?php

    namespace Modules;

    class cpu extends \ld\Modules\Module {
        protected $name = 'cpu';
        protected $raw_output = true;

        public function getData($args=array()) {
			$data = array();
			
			exec(
                "/usr/bin/sar -P ALL 0 |sed -n '5,6p'"
                $result
            );
return $result;
	    //return shell_exec('/bin/cat /home/linaro/003/oo.log');

            $result = array_filter($result);

		foreach ($result as $a) {
		$p = explode(' ', $a);

                $data[$p[1]] = $p[7];
            }
			
			return $data;
        }
    }

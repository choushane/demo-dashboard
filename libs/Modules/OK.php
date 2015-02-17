<?php

    namespace Modules;

    class OK extends \ld\Modules\Module {
        protected $name = 'OK';
        protected $raw_output = true;

        public function getData($args=array()) {
			$data = array();

			exec(
                "/bin/ls -al /home/linaro/".$args['id']."/OK|awk '{print $6\":\"$7\":\"$8}'",
                $result_1
            );
	    if($result_1)
	    return 1;
	    else
	    return 0;

	    //return shell_exec('/bin/cat /home/linaro/003/oo.log');
	    return $result;

            $result = array_filter($result);

		foreach ($result as $a) {
		$p = explode(':', $a);

                //$data[$p[0]] = $p[1];
		return $p[1];
		break;
            }
			
			return $data;
        }
    }

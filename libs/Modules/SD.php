<?php

    namespace Modules;

    class SD extends \ld\Modules\Module {
        protected $name = 'SD';
        protected $raw_output = true;

        public function getData($args=array()) {
			$data = array();
			
	    exec("df -h |grep root |awk '{print $2}'",$data[free]);
	    exec("df -h |grep root |awk '{print $4}'",$data[total]);
	    exec("df -h |grep root |awk '{print $5}'|awk 'BEGIN{FS=\"%\"} {print $1}'",$data[percent]);
	    return $data;

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
